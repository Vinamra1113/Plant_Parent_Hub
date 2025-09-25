/**
 * @description This trigger runs after a new User record is created.
 * It identifies new community users and calls a future method to assign them
 * the 'Plant Hub User' permission set, avoiding Mixed DML errors.
 */
trigger AssignPermSetToNewCommunityUser on User (after insert) {

    // Find the 'Customer Community User' Profile ID
    Profile communityProfile = [SELECT Id FROM Profile WHERE Name = 'Customer Community User' LIMIT 1];

    // Create a set to hold the IDs of the new users we need to process
    Set<Id> newCommunityUserIds = new Set<Id>();

    // Loop through all the new users
    for (User newUser : Trigger.new) {
        // Check if the user has the correct community profile
        if (newUser.ProfileId == communityProfile.Id) {
            // If they do, add their ID to our set
            newCommunityUserIds.add(newUser.Id);
        }
    }

    // If we found any new community users, call the future method to process them
    if (!newCommunityUserIds.isEmpty()) {
        UserRegistrationHelper.assignPlantHubPermissionSet(newCommunityUserIds);
    }
}