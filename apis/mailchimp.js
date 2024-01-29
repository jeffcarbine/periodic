import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMPAPIKEY,
  server: process.env.MAILCHIMPSERVER,
});

const listId = process.env.MAILCHIMPLISTID;

export const addSubscribingUser = async (
  FNAME,
  LNAME,
  email_address,
  tags = [],
  callback
) => {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address,
    status: "subscribed",
    tags,
    merge_fields: {
      FNAME,
      LNAME,
    },
  });

  callback(response.id);
};
