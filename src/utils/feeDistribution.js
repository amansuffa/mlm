import { User } from "@/models/User";

/**
 * Distribute membership fee according to 1-Up Pass-Up logic:
 * - First invite's fee goes to referrer's sponsor (1-up pass-up)
 * - Second+ invites' fee goes to the referrer
 * 
 * @param {Object} newMember - The user who just paid membership fee
 * @param {Number} feeAmount - The fee amount (default $500)
 * @returns {Object} - Result with recipient user and distribution info
 */
export async function distributeMembershipFee(newMember, feeAmount = 500) {
  try {
    // Agar user ka koi referrer nahi hai, to fee distribute nahi hogi
    if (!newMember.referredBy) {
      console.log(`No referrer found for user ${newMember.username}. Fee distribution skipped.`);
      return {
        success: false,
        message: "No referrer found",
        recipient: null,
      };
    }

    // Direct referrer find karo (jo user ko invite kiya)
    const directReferrer = await User.findOne({ username: newMember.referredBy });
    
    if (!directReferrer) {
      console.log(`Referrer ${newMember.referredBy} not found. Fee distribution skipped.`);
      return {
        success: false,
        message: "Referrer not found",
        recipient: null,
      };
    }

    // Direct referrer ki invite count check karo
    const inviteCount = directReferrer.directInvitesCount || 0;
    
    let recipientUser;
    let distributionType;

    if (inviteCount === 0) {
      // Pehla invite hai - 1-Up Pass-Up
      // Fee referrer ke sponsor ko jayegi
      if (directReferrer.referredBy) {
        recipientUser = await User.findOne({ username: directReferrer.referredBy });
        
        if (!recipientUser) {
          console.log(`Sponsor ${directReferrer.referredBy} not found. Fee distribution skipped.`);
          return {
            success: false,
            message: "Sponsor not found",
            recipient: null,
          };
        }
        
        distributionType = "pass_up"; // 1-Up pass-up
      } else {
        // Referrer ka bhi koi sponsor nahi hai
        console.log(`Referrer ${directReferrer.username} has no sponsor. Fee distribution skipped.`);
        return {
          success: false,
          message: "No sponsor found for referrer",
          recipient: null,
        };
      }
    } else {
      // Doosra ya usse zyada invite hai
      // Fee direct referrer ko jayegi
      recipientUser = directReferrer;
      distributionType = "direct"; // Direct payment to referrer
    }

    // Recipient user ki earnings update karo
    if (recipientUser) {
      recipientUser.earnings = recipientUser.earnings || {
        total: 0,
        history: [],
      };

      recipientUser.earnings.total += feeAmount;
      recipientUser.earnings.history.push({
        amount: feeAmount,
        date: new Date(),
        source: distributionType === "pass_up" ? "passup" : "direct"
      });
      
      await recipientUser.save();

      // Direct referrer ki invite count increment karo
      directReferrer.directInvitesCount = (directReferrer.directInvitesCount || 0) + 1;
      await directReferrer.save();

      return {
        success: true,
        recipient: recipientUser,
        referrer: directReferrer,
        amount: feeAmount,
        distributionType, // "pass_up" or "direct"
        inviteNumber: inviteCount + 1,
      };
    }

    return {
      success: false,
      message: "Failed to update earnings",
      recipient: null,
    };
  } catch (error) {
    console.error("Error in fee distribution:", error);
    return {
      success: false,
      message: error.message,
      recipient: null,
    };
  }
}

