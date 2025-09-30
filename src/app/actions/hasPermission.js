import { User } from "@/models/User";


export async function hasPermission(userId) {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return false;
    }
    
    if (user.role === "admin") {
      return true;
    }
    
    if (user.status === "membership_paid" || user.status === "fully_active") {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error checking user permissions:", error);
    return false;
  }
}