import { LightningElement, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

// Import all necessary Apex methods
import getPlants from '@salesforce/apex/PlantController.getPlants';
import deletePlant from '@salesforce/apex/PlantController.deletePlant';

export default class PlantManager extends LightningElement {
    // Properties for data and state
    plants = [];
    error;
    isLoading = true;
    wiredPlantsResult; // Property to hold the provisioned wire data for refreshApex

    @track selectedPlant; // Holds the full record of the selected plant

    // Wire service to fetch the initial list of plants
    @wire(getPlants)
    wiredPlants(result) {
        this.wiredPlantsResult = result; // Store the provisioned object
        if (result.data) {
            this.plants = result.data;
            this.error = undefined;
            this.isLoading = false; // Stop loading only after data is processed
        } else if (result.error) {
            this.error = result.error;
            this.plants = [];
            console.error('Error fetching plants:', result.error);
            this.isLoading = false; // Stop loading even if there is an error
        }
    }

    // --- Getters for Template ---

    // Getter to safely check if we have data to display
    get hasData() {
        return this.plants && this.plants.length > 0 && !this.isLoading;
    }

    // Getter to format any potential error message for display
    get errorText() {
        if (this.error) {
            if (this.error.body && this.error.body.message) {
                return this.error.body.message;
            }
            if (Array.isArray(this.error.body)) {
                return this.error.body.map(e => e.message).join(', ');
            }
            return 'An unknown error occurred.';
        }
        return '';
    }

    // --- Event Handlers ---

    // Handles the 'plantselect' event from the gallery
    handlePlantSelect(event) {
        const plantId = event.detail;
        // Find the full plant object from our wired data
        this.selectedPlant = this.plants.find(plant => plant.Id === plantId);
    }

    // Handles the 'closemodal' event from the detail viewer
    handleCloseDetailModal() {
        this.selectedPlant = null; // Setting this to null hides the detail viewer
    }

    // Handles the click of the 'Add New Plant' button
    handleAddNewPlant() {
        // Find the editor component and call its public 'open' method
        this.template.querySelector('c-plant-editor').open(null); // Pass null for a new record
    }

    // Handles the 'editplant' event from the detail viewer
    handleEditPlant() {
        // Find the editor and call its public 'open' method with the selected plant's ID
        this.template.querySelector('c-plant-editor').open(this.selectedPlant.Id);
        this.handleCloseDetailModal(); // Close the detail modal
    }

    // Handles the 'deleteplant' event from the detail viewer
    handleDeletePlant() {
        // We call the imperative Apex method
        deletePlant({ plantId: this.selectedPlant.Id })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Plant record deleted successfully.',
                        variant: 'success'
                    })
                );
                this.handleCloseDetailModal();
                this.refreshGallery(); // Refresh the data
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Deleting Record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }

    // Handles the 'save' event from the editor
    handleSave() {
        // When a save happens in the editor, we just need to refresh the gallery
        this.refreshGallery();
    }

    // Utility function to refresh the plant data
    refreshGallery() {
        this.isLoading = true;
        return refreshApex(this.wiredPlantsResult).finally(() => {
            this.isLoading = false;
        });
    }
}