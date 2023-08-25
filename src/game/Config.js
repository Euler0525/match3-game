import { Game } from "./Game";


export class Config {
    static loader = Config.massiveRequire(require["context"]('./../../assets/', true, /\.(png|jpe?g)$/));
    static startScene = Game;
    static tilesColors = ['blue', 'green', 'orange', 'red', 'pink', 'yellow', 'black'];
    static board = {
        rows: 9,
        cols: 9
    };
    static combinationRules = [
        [
            { col: 1, row: 0 }, { col: 2, row: 0 },
        ],
        [
            { col: 0, row: 1 }, { col: 0, row: 2 },
        ]
    ];

    static massiveRequire(req) {
        const files = [];

        req.keys().forEach(key => {
            files.push({
                key, data: req(key)
            });
        });

        return files;
    }
}
