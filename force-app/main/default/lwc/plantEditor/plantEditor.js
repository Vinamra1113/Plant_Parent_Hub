import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PlantEditor extends LightningElement {
    recordId; // Holds the record ID for editing, or null for creating
    isModalOpen = false;

    // Public method that can be called by a parent component
    @api 
    open(plantId) {
        this.recordId = plantId; // If plantId is passed, we are editing
        this.isModalOpen = true;
    }

    // Getter to dynamically set the modal title
    get modalTitle() {
        return this.recordId ? 'Edit Plant' : 'Add New Plant';
    }

    // Handles the click on the 'Save' button in the footer
    handleSave() {
        // Find the record-edit-form and trigger its submit method
        const form = this.template.querySelector('lightning-record-edit-form');
        form.submit();
    }

    // Called automatically when the record-edit-form saves successfully
    handleSuccess(event) {
        const toast = new ShowToastEvent({
            title: 'Success!',
            message: `Plant "${event.detail.fields.Name.value}" was saved.`,
            variant: 'success'
        });
        this.dispatchEvent(toast);
        
        // Dispatch a custom event to tell the parent component that a save happened
        this.dispatchEvent(new CustomEvent('save'));
        
        this.handleClose(); // Close the modal
    }

    // Called if there is an error during form submission
    handleError(event) {
        console.error('Error saving record:', JSON.stringify(event.detail));
        const toast = new ShowToastEvent({
            title: 'Error Saving',
            message: 'There was a problem saving the record. Please check the form.',
            variant: 'error'
        });
        this.dispatchEvent(toast);
    }
    
    // Closes the modal and resets the state
    handleClose() {
        this.isModalOpen = false;
        this.recordId = null;
    }
}