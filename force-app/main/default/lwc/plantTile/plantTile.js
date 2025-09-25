import { LightningElement, api } from 'lwc';

export default class PlantTile extends LightningElement {
    @api plant;

    get imageStyle() {
        // Guard clause is still useful here
        if (!this.plant) {
            return `background-image: url('https://placehold.co/300x200/cccccc/ffffff?text=Loading...')`;
        }
        const imageUrl = this.plant.Plant_Picture_URL__c 
            ? this.plant.Plant_Picture_URL__c 
            : 'https://placehold.co/300x200/a3e635/ffffff?text=My+Plant';
        return `background-image: url(${imageUrl})`;
    }

    get wateringStatusClass() {
        if (!this.plant || !this.plant.Next_Watering_Date__c) {
            return 'status-indicator status-unknown';
        }

        const baseClass = 'status-indicator';
        const nextWatering = new Date(this.plant.Next_Watering_Date__c + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (nextWatering < today) {
            return baseClass + ' status-overdue';
        } else if (nextWatering.getTime() === today.getTime()) {
            return baseClass + ' status-due';
        } else {
            return baseClass + ' status-ok';
        }
    }

    get wateringStatusText() {
        if (!this.plant || !this.plant.Next_Watering_Date__c) {
            return 'Watering status unknown';
        }
        
        const nextWatering = new Date(this.plant.Next_Watering_Date__c + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round((nextWatering - today) / oneDay);

        if (diffDays < 0) {
            return `Overdue by ${Math.abs(diffDays)} day(s)`;
        } else if (diffDays === 0) {
            return 'Needs watering today';
        } else {
            return `Next watering in ${diffDays} day(s)`;
        }
    }

    handleClick() {
        if (this.plant) {
            const selectEvent = new CustomEvent('plantselect', {
                detail: this.plant.Id
            });
            this.dispatchEvent(selectEvent);
        }
    }
}