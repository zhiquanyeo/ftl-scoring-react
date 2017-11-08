export default {
    calculateScores: (matchInfo) => {
        var redScoreObj = matchInfo.scores.red;
        var blueScoreObj = matchInfo.scores.blue;
        var redScore = redScoreObj.auto + redScoreObj.teleop + redScoreObj.others + blueScoreObj.fouls + blueScoreObj.techFouls;
        var blueScore = blueScoreObj.auto + blueScoreObj.teleop + blueScoreObj.others + redScoreObj.fouls + redScoreObj.techFouls;

        return {
            red: redScore,
            blue: blueScore
        }
    },
    
};