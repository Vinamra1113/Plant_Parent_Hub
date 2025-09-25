/**
 * @description Apex controller for the Plant Parent Hub LWC components.
 * This class handles all server-side logic and data operations for plants and their care logs.
 * It is built with "with sharing" to enforce record ownership for Experience Cloud users.
 */
public with sharing class PlantController {

    /**
     * @description Fetches the Plant records owned by the current context user.
     * The @AuraEnabled(cacheable=true) annotation makes this method available to LWCs and caches the results for performance.
     * @return List<Plant__c> A list of plants owned by the user.
     */
    @AuraEnabled(cacheable=true)
    public static List<Plant__c> getPlants() {
        // We query for all the fields that our components will need to display.
        // WITH SECURITY_ENFORCED respects the user's field-level security and sharing rules.
        return [
            SELECT 
                Id, 
                Name, 
                Species__c, 
                Plant_Picture_URL__c, 
                Last_Watered_Date__c,
                Next_Watering_Date__c,
                Location__c,
                Sunlight_Needs__c,
                Description__c,
                Date_Acquired__c
            FROM Plant__c 
            WITH SECURITY_ENFORCED
            ORDER BY Name
        ];
    }

    /**
     * @description Fetches all related Care Log records for a specific Plant.
     * @param plantId The Id of the Plant__c record passed from the LWC.
     * @return List<Care_Log__c> A list of care logs for the given plant.
     */
    @AuraEnabled(cacheable=true)
    public static List<Care_Log__c> getCareLogs(String plantId) {
        // This query finds all child Care_Log__c records for a specific parent Plant__c.
        return [
            SELECT Id, Action_Taken__c, Log_Date__c, Notes__c 
            FROM Care_Log__c 
            WHERE Plant__c = :plantId 
            WITH SECURITY_ENFORCED
            ORDER BY Log_Date__c DESC
        ];
    }
    
    /**
     * @description Saves a Plant record (used for both creating new plants and updating existing ones).
     * This method is "upserting" the record.
     * @param plantToSave The Plant__c record passed from the LWC.
     * @return Id The ID of the saved record.
     */
    @AuraEnabled
    public static Id savePlant(Plant__c plantToSave) {
        // The 'upsert' command will insert a new record if the Id is null, 
        // or update an existing record if the Id is provided.
        // This is very efficient for handling both create and edit forms.
        try {
            upsert plantToSave;
            return plantToSave.Id;
        } catch (Exception e) {
            // This allows us to pass a clear error message back to the LWC.
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
     * @description Creates a 'Watered' Care Log for a given plant and updates the plant's Last Watered Date.
     * This method is called imperatively from an LWC when a user clicks a "Water Me" button.
     * @param plantId The Id of the Plant__c record to update.
     * @return String A success message.
     */
    @AuraEnabled
    public static String logWateringAction(String plantId) {
        try {
            // We need to get the existing plant record to update it.
            Plant__c plantToUpdate = [SELECT Id FROM Plant__c WHERE Id = :plantId WITH SECURITY_ENFORCED];

            // Set the Last Watered Date to today. The formula field for Next Watering Date will update automatically.
            plantToUpdate.Last_Watered_Date__c = Date.today();
            update plantToUpdate;

            // Create the new care log to record this action.
            Care_Log__c newLog = new Care_Log__c(
                Plant__c = plantId,
                Action_Taken__c = 'Watered',
                Log_Date__c = Datetime.now()
            );
            insert newLog;

            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException('Error logging watering action: ' + e.getMessage());
        }
    }

    /**
     * @description Deletes a plant record. Called imperatively from an LWC.
     * @param plantId The Id of the Plant__c record to delete.
     * @return String A success message.
     */
    @AuraEnabled
    public static String deletePlant(String plantId) {
        try {
            // Find the record to delete, ensuring the user has access.
            Plant__c plantToDelete = [SELECT Id FROM Plant__c WHERE Id = :plantId WITH SECURITY_ENFORCED];
            delete plantToDelete;
            return 'Success';
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting record: ' + e.getMessage());
        }
    }
}