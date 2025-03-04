const moduleID = 'enso-combat-hud';

const lg = x => console.log(x);

Hooks.once('init', () => {
    const combatHUD = document.createElement('div');
    combatHUD.id = 'enso-combat-hud';
    combatHUD.classList.add('app');

    document.querySelector('header#ui-top').prepend(combatHUD);
});


Hooks.on('renderCombatTracker', async () => {
    const combatHUD = document.querySelector('#enso-combat-hud');
    if (!combatHUD) return;

    if (!game.combat?.started) {
        combatHUD.style.height = 0;
        return;
    }

    const turns = game.combat.turns.map(t => ({
        img: t.img
    }));
    if (Number.isInteger(game.combat.turn)) turns[game.combat.turn].isTurn = true;
    const innerHTML = await renderTemplate(`modules/${moduleID}/templates/${moduleID}.hbs`, { turns });
    combatHUD.innerHTML = innerHTML;
    combatHUD.style.height = '100px';

    lg(combatHUD)
});


class EnsoCombatHUD extends Application {
    static get defaultOptions() {
        return {
            height: 100,
            popOut: false,
            id: moduleID,
            template: `modules/${moduleID}/templates/${moduleID}.hbs`,
            classes: ['app']
        }
    }

    getData() {
        const context = {
            turns: game.combat.turns.map(t => ({
                img: t.img
            }))
        }
        if (Number.isInteger(game.combat.turn)) context.turns[game.combat.turn].isTurn = true;

        return context;
    }
}