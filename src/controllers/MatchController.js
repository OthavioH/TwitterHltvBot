const {HLTV} = require('hltv');
const putMatchID = require('../setMatch');

module.exports = {
    getAllMatches(req,res){

        HLTV.getMatches().then((result)=>{
            return res.status(200).json({
                allData:result
            });
        })
        .catch((err)=>{
            return res.status(400).json({error:err})
        })
    },
    connectMatch(req,res){
        const {matchID} = req.params;

        if(matchID){
            try{
                putMatchID(req.params.matchID);
            }
            catch {
                return res.status(401).json({error:'Erro ao tentar mudar de partida'});
            }
            return res.status(200);
        }
    }, 
}