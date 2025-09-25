/**
 * @description This helper class contains asynchronous methods to handle logic
 * that needs to run in a separate transaction from the initial record trigger,
 * specifically to avoid Mixed DML errors during user self-registration.
 */
public class UserRegistrationHelper {

    /**
     * @description This future method runs in a separate transaction to assign the 
     * 'Plant Hub User' permission set to newly created community users.
     * @param newUserIds A set of IDs for the user records that were just created.
     */
    @future
    public static void assignPlantHubPermissionSet(Set<Id> newUserIds) {
        
        // Find the 'Plant Hub User' Permission Set ID
        PermissionSet plantPermSet = [SELECT Id FROM PermissionSet WHERE Name = 'Plant_Hub_User' LIMIT 1];
        
        List<PermissionSetAssignment> assignmentsToInsert = new List<PermissionSetAssignment>();

        // Loop through the user IDs that were passed in from the trigger
        for (Id userId : newUserIds) {
            
            // Create a new Permission Set Assignment record for each new user
            PermissionSetAssignment psa = new PermissionSetAssignment(
                AssigneeId = userId,
                PermissionSetId = plantPermSet.Id
            );
            
            assignmentsToInsert.add(psa);
        }
        
        // If our list is not empty, insert all the new assignments
        if (!assignmentsToInsert.isEmpty()) {
            insert assignmentsToInsert;
        }
    }
}