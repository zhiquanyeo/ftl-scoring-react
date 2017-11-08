export default {
    getActiveMatch: (tournamentInfo) => {
        for (var i = 0; i < tournamentInfo.matchList.length; i++) {
            if (tournamentInfo.matchList[i].matchName === tournamentInfo.activeMatch) {
                return tournamentInfo.matchList[i];
            }
        }
        return null;
    }
}