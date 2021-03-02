function checkPermission(profile, action, data) {
  if (profile === undefined) {
    return false;
  }

  if (profile.permissions.includes(action)) {
    return true;
  }

  return false;
}

function getRole(profile) {
  return profile.role;
}

export { checkPermission, getRole };
