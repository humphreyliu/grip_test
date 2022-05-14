import unittest
from py_quiz import getUserAppPermissions

class TestGetUserAppPermissions(unittest.TestCase):
    def setUp(self):
        self.apps = [{"app_id": 1}, {"app_id": 2}, {"app_id": 3}, {"app_id": 126}]
        self.features = [
            {"app_id": 1, "features_available": [1, 2, 3]}, 
            {"app_id": 2, "features_available": [3, 4, 5, 7]}, 
            {"app_id": 3, "features_available": [3, 12]}
        ]
        self.userFeatures = [
            {"user_id": 1, "features_allowed": [1, 2, 5]}, 
            {"user_id": 2, "features_allowed": [1, 2, 3, 4,]}, 
            {"user_id": 3, "features_allowed": []}
        ]

    # Test arguments
    def test_userId_argument(self):
        with self.assertRaises(Exception):
            getUserAppPermissions(None, None, None, None)

    def test_apps_argument(self):
        with self.assertRaises(Exception):
            getUserAppPermissions(1, None, None, None)

    def test_appFeatures_argument(self):
        with self.assertRaises(Exception):
            getUserAppPermissions(1, [], None, None)

    def test_userFeatures_argument(self):
        with self.assertRaises(Exception):
            getUserAppPermissions(1, [], [], None)


    # Test functions
    def test_with_no_data(self):
        self.assertDictEqual(getUserAppPermissions(1, [], [], []), {'user_id': 1, 'application_permissions': []})

    def test_with_no_apps_data(self):
        self.assertDictEqual(getUserAppPermissions(1, [], self.features, self.userFeatures), {'user_id': 1, 'application_permissions': []})

    def test_with_no_appFeatures_data(self):
        expectedOutput = {
            "user_id": 1,
            "application_permissions": [
                {"app_id": 1, "features_allowed": []},
                {"app_id": 2, "features_allowed": []},
                {"app_id": 3, "features_allowed": []},
                {"app_id": 126, "features_allowed": []},
            ]

        }
        self.assertDictEqual(getUserAppPermissions(1, self.apps, [], self.userFeatures), expectedOutput)

    def test_with_no_userFeatures_data(self):
        expectedOutput = {
            "user_id": 1,
            "application_permissions": [
                {"app_id": 1, "features_allowed": []},
                {"app_id": 2, "features_allowed": []},
                {"app_id": 3, "features_allowed": []},
                {"app_id": 126, "features_allowed": []},
            ]

        }
        self.assertDictEqual(getUserAppPermissions(1, self.apps, self.features, []), expectedOutput)

    # Test with test data
    def test_with_data(self):
        expectedOutput = {
            "user_id": 1,
            "application_permissions": [
                {"app_id": 1, "features_allowed": [1, 2]},
                {"app_id": 2, "features_allowed": [5]},
                {"app_id": 3, "features_allowed": []},
                {"app_id": 126, "features_allowed": []},
            ]

        }
        self.assertDictEqual(getUserAppPermissions(1, self.apps, self.features, self.userFeatures), expectedOutput)
