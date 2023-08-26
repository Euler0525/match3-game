import { App } from "../system/App";

export class CombinationManager {
    constructor(board) {
        this.board = board;
    }

    getMatches() {
        let result = [];

        this.board.fields.forEach(checkingField => {
            App.config.combinationRules.forEach(rule => {
                let matches = [checkingField.tile];
                let specialMatches = [checkingField];

                rule.forEach(position => {
                    const row = checkingField.row + position.row;
                    const col = checkingField.col + position.col;
                    const comparingField = this.board.getField(row, col);

                    // 判断是否能够消除
                    if (comparingField && comparingField.tile.color === checkingField.tile.color) {
                        matches.push(comparingField.tile);
                        specialMatches.push(comparingField)
                    }
                });

                // 添加特殊图块功能
                let tmpSpecialMatches = specialMatches;
                if (tmpSpecialMatches.length === rule.length + 1 && tmpSpecialMatches[0].tile.color == 'black') {
                    for (let i = 0; i < tmpSpecialMatches.length; ++i) {
                        for (let r = 0; r < 9; ++r) {
                            const tmpField1 = this.board.getField(r, specialMatches[i].col);
                            matches.push(tmpField1.tile);
                            const tmpField2 = this.board.getField(specialMatches[i].row, r);
                            matches.push(tmpField2.tile);
                        }
                    }
                }

                if (matches.length >= rule.length + 1) {
                    result.push(matches);
                }

            });
        });

        return result;
    }
}
