import { LightningElement, api } from 'lwc';

export default class PlantDetailViewer extends LightningElement {
    // Public property to receive the full plant record object from the parent
    @api plant;

    // Getter to create the background image style for the plant picture
    get imageStyle() {
        // We use the same fallback logic as in the tile component
        const imageUrl = this.plant.Plant_Picture_URL__c
            ? this.plant.Plant_Picture_URL__c
            : 'https://placehold.co/600x400/a3e635/ffffff?text=My+Plant';
        return `background-image: url(${imageUrl})`;
    }

    // Dispatches a custom event to notify the parent to close the modal
    handleClose() {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    // Dispatches a custom event to notify the parent to open the edit form
    handleEdit() {
        this.dispatchEvent(new CustomEvent('editplant'));
    }
    
    // Dispatches a custom event to notify the parent to handle the delete action
    handleDelete() {
        this.dispatchEvent(new CustomEvent('deleteplant'));
    }
}