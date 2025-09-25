import { LightningElement, api, wire } from 'lwc';
// Import the Apex method to get care logs
import getCareLogs from '@salesforce/apex/PlantController.getCareLogs';

export default class CareLogList extends LightningElement {
    // Public property to receive the Plant record ID from a parent component
    @api recordId;

    // Properties for data and state management
    careLogs;
    error;
    isLoading = true;

    // Use the @wire adapter to call the Apex method reactively.
    // The '$recordId' syntax makes the wire service re-invoke the Apex method
    // whenever the recordId property changes.
    @wire(getCareLogs, { plantId: '$recordId' })
    wiredLogs({ error, data }) {
        this.isLoading = false; // Stop loading spinner once a result is received
        if (data) {
            this.careLogs = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            console.error('Error fetching care logs:', error);
            this.careLogs = undefined;
        }
    }

    // Getter to determine if the 'no logs found' message should be shown
    get noLogsFound() {
        // Return true if not loading and the careLogs array is either undefined or empty
        return !this.isLoading && (!this.careLogs || this.careLogs.length === 0);
    }
}