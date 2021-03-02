// API => model transormation
export function Profile(jsonData) {
  let zoneUrl = new URL(jsonData.zoneUrlV1).origin;

  let data = {
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
    role: jsonData.roles,

    // Note: call window.appConfig.setEndpoints() to promote new api urls after changing them in window.appConfig
    // see auth.js setProfile
    zoneUrl: zoneUrl, // base url
    zoneUrlV1: jsonData.zoneUrlV1, // v1 endpoints
    zoneUrlV2: jsonData.zoneUrlV2, // v2 endpoints
    inactivityTimeout: window.appConfig.inactivityTimeout,
    homeUrl: jsonData.homeUrl,
  };

  return data;
}
