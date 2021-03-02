// API => model transormation
export function Profile(jsonData) {
  let zoneUrl = new URL(jsonData.zoneUrlV1).origin;

  let data = {
    _modelName: "Profile",
    user: {
      id: jsonData.user.id,
      name: jsonData.user.name + " " + jsonData.user.last_name,
      email: jsonData.user.email,
      missionId: jsonData.user.missionUserId,
      missionName: jsonData.user.missionName,
      organizationId: jsonData.user.organisationId,
      organizationName: jsonData.user.organisationName,
    },
    address: {
      site: jsonData.address.siteName,
      iso: jsonData.address.iso,
    },
    //role: jsonData.roles,
    role: window.const.ROLE_ADMIN,
    // dynamically get via API, this may change with every plan
    permissions: [
      window.const.PLAN_READ,
      window.const.DRAFT_READ,
      window.const.DRAFT_DELETE,
      window.const.DRAFT_UPDATE,
      window.const.CONTENT_SUBMIT,
    ],

    // Note: call window.appConfig.setEndpoints() to promote new api urls after changing them in window.appConfig
    // see auth.js setProfile
    zoneUrl: zoneUrl, // base url
    zoneUrlV1: jsonData.zoneUrlV1, // v1 endpoints
    zoneUrlV2: jsonData.zoneUrlV2, // v2 endpoints
    inactivityTimeout: window.appConfig.inactivityTimeout,
    homeUrl: jsonData.homeUrl,

    mfa: {
      qr: jsonData.MFAbase64,
      firstLoad: jsonData.firstMFA,
      organizationMfa: 0,
      emailNotification: 0,
      smsNotification: 0,
    },
    image: jsonData.s,
  };

  // detect MFA
  if (jsonData.user.organisationMFA !== undefined) {
    data.mfa.organizationMfa = jsonData.user.organisationMFA.mfa;
    data.mfa.emailNotification =
      jsonData.user.organisationMFA.emailNotification;
    data.mfa.smsNotification = jsonData.user.organisationMFA.smsNotification;
  }

  return data;
}
