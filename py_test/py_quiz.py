

def getUserAppPermissions(userId : int, apps : list, appFeatures : list, userFeatures : list):
    """Get user permissions on each app

    Args:
        userId (int): user ID
        apps (list): apps array: [{'app_id': 1}, ...]
        appFeatures (list): app features array: [{'app_id': 1, 'features_available': [1, 2, 3]}, ...]
        userFeatures (list): user features array: [{'user_id': 1, 'features_allowed': [1, 2], ...}]
    
    Returns:
        user app permissions: ['user_id': 1, 'application_permissions': [{'app_id': 1, 'features_allowed': [1, 2]}]]
    """
    # Step 1: Check arguments
    if userId is None or not isinstance(userId, int):
        raise Exception("userId can not be None, and can only be int.")

    if apps is None or not isinstance(apps, list):
        raise Exception("apps can not be None, and can only be list.")

    if appFeatures is None or not isinstance(appFeatures, list):
        raise Exception("appFeatures can not be None, and can only be list.")

    if userFeatures is None or not isinstance(userFeatures, list):
        raise Exception("userFeatures can not be None, and can only be list.")

    # Step 2: Get user features of this userId by iterating userFeatures
    featureSet = set()
    for userFeat in userFeatures:
        if userFeat['user_id'] == userId:
            features = userFeat['features_allowed']
            # Found the user. Save into a set for further usage. It will be used to get permissions of each app
            for featId in features:
                featureSet.add(featId)
            # Do not need to iterate anymore
            break

    # Step 3: For easy to use, convert appFeatures to appId => feature
    appFeatureDict = {}
    for appFeat in appFeatures:
        appFeatureDict[appFeat['app_id']] = appFeat['features_available']

    # Step 4: Get user app permissions
    userAppPermissions = {"user_id": userId, "application_permissions": []}
    # Iterate all apps
    for app in apps:
        appId = app['app_id']
        # Get the features of this app
        appFeature = []
        if appId in appFeatureDict:
            appFeature = appFeatureDict[appId]

        # Compare app feature with user feature, and get the permission of this app
        userAppFeatures = []
        for feat in appFeature:
            # If the feature is found in user's feature set, append it into userAppFeatures
            if feat in featureSet:
                userAppFeatures.append(feat)

        # Append the permissions of this app
        userAppPermissions['application_permissions'].append({'app_id': appId, 'features_allowed': userAppFeatures})

    return userAppPermissions
