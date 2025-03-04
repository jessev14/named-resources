const moduleID = 'named-resources';

const lg = x => console.log(x);


Hooks.once('init', () => {
    libWrapper.register(moduleID, 'CONFIG.DND5E.activityConsumptionTypes.itemUses.consume', consume, 'WRAPPER');
    libWrapper.register(moduleID, 'CONFIG.DND5E.activityConsumptionTypes.itemUses.consumptionLabels', consumptionLabels, 'WRAPPER');


    CONFIG.DND5E.activityConsumptionTypes.namedResource = {
        consume: CONFIG.DND5E.activityConsumptionTypes.itemUses.consume,
        consumptionLabels: CONFIG.DND5E.activityConsumptionTypes.itemUses.consumptionLabels,
        label: 'Named Resource',
        targetRequiresEmbedded: false,
        validTargets: null
    };
});


Hooks.on('getItemSheet5e2HeaderButtons', (sheet, buttons) => {
    const { item } = sheet;
    buttons.unshift({
        class: moduleID,
        icon: 'fa-solid fa-star',
        label: 'Configure Named Resource',
        onclick: () => new nrConfig(item).render(true)
    });
});


async function consume(wrapped, ...args) {
    if (this.type === 'namedResource') this.target = this.actor.items.find(i => i.getFlag(moduleID, 'resourceKey') === this.target)?.id;
    return wrapped(...args);
}

function consumptionLabels(wrapped, ...args) {
    if (this.type === 'namedResource') this.target = this.actor.items.find(i => i.getFlag(moduleID, 'resourceKey') === this.target)?.id;
    return wrapped(...args);
}


class nrConfig extends FormApplication {
    constructor(object) {
        super(object);
        this.item = object;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["sheet"],
            template: `modules/${moduleID}/templates/nr-config.hbs`,
            title: 'Named Resource Configuration'

        });
    }

    getData() {
        const context = {
            moduleID,
            item: this.item,
            isNamedResource: this.item.getFlag(moduleID, 'isNamedResource'),
            resourceKey: this.item.getFlag(moduleID, 'resourceKey')
        }
        return context;
    }

    async _updateObject(event, formData) {
        await this.item.setFlag(moduleID, 'isNamedResource', formData[`flags.${moduleID}.isNamedResource`]);
        await this.item.setFlag(moduleID, 'resourceKey', formData[`flags.${moduleID}.resourceKey`] || this.item.name);
    }
}
