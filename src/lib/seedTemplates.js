
import {EmailTemplate} from "@/models/EmailTemplate";

export async function seedEmailTemplates() {
  const defaults = [
    {
      name: "Welcome Email",
      subject: "Welcome to our MLM Network!",
      body: "Hello {{member_name}},\n\nThanks for joining our platform. Let's grow together!",
      isDefault: true
    },
    {
      name: "Payment Reminder",
      subject: "Your membership fee is due",
      body: "Hello {{member_name}},\n\nPlease complete your payment to unlock full benefits.",
      isDefault: true
    },
    {
      name: "Sponsor Notification",
      subject: "New Referral Joined",
      body: "Hello {{sponsor_username}},\n\nYou have a new member in your downline: {{member_name}}.",
      isDefault: true
    }
  ];

  for (const tpl of defaults) {
    const exists = await EmailTemplate.findOne({ name: tpl.name, isDefault: true });
    if (!exists) {
      await EmailTemplate.create(tpl);
      console.log(`Seeded default email template: ${tpl.name}`);
      
    }
  }
}
