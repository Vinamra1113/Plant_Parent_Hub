import { LightningElement, api, track } from 'lwc';

export default class PlantGallery extends LightningElement {
    // Use a private property to store the incoming data
    _plants = [];

    // This is the setter. It runs whenever the 'plants' property is updated by the parent.
    @api
    get plants() {
        return this._plants;
    }
    set plants(data) {
        if (data) {
            this._plants = data;
            // When new data arrives, we reset the filtered list with it.
            this.filteredPlants = data;
        }
    }

    // Initialize filteredPlants as an empty array to prevent the error.
    @track filteredPlants = [];

    // The connectedCallback is no longer needed for this logic.

    // Handler for the search input field
    handleSearchChange(event) {
        const searchTerm = event.target.value.toLowerCase();

        // We filter from our original, unmodified list (_plants)
        this.filteredPlants = this._plants.filter(plant =>
            (plant.Name && plant.Name.toLowerCase().includes(searchTerm)) ||
            (plant.Species__c && plant.Species__c.toLowerCase().includes(searchTerm))
        );
    }

    // This getter is now safe because filteredPlants is always an array.
    get noPlantsFound() {
        return this.filteredPlants.length === 0;
    }

    // Handler for the 'plantselect' event from the child tile
    handlePlantSelect(event) {
        // This component doesn't need to handle the event directly.
        // It simply dispatches a new event to pass the selection up to the plantManager.
        const selectionEvent = new CustomEvent('plantselect', {
            detail: event.detail,
            bubbles: true // 'bubbles' allows the event to pass through parent components
        });
        this.dispatchEvent(selectionEvent);
    }
}