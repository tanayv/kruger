
var addCard = function(title, desc, due, list) {    
    if (list = 'hw')
        var listID = '59ad8e8bb34eb055223399d7';
    else if (list = 'side')
        var listID = '59ad8e94e2f50ce6fdd7f3f2';
    else if (list = 'exam')
        var listID = '59b9f99917b3d05d8c27374e';
    
    var options = {
        "key": '6663212c465dd85d568ed53171ab4619',
        "token": '191e775a7e6ee058ae9c6af6b7b7294409bbfc0e3cbcd61508ab68e75e3476d3',
    };

    var body = {
        name: title, 
        desc: desc,
        due: due,
        idList: listID
    };

    var reqStatus = 2;
    request.post({
        "uri": "https://api.trello.com/1/cards",
        "qs": options,
        "json": body
      }, (err, res, body) => {
        if (err) {
          console.log("Trello API Error: " + err);
          reqStatus = 1;
        } else {
          console.log("Successfully added to Trello");
          reqStatus = 2;
        }
      }); 

    if (reqStatus == 1)
        return "Couldn't connect to Trello";
    else if (reqStatus == 2)
        return "Daal toh diya but tu ullu deadline ke 2-3 ghante pehle tak nahi khatam karega ye jo bhi hai usko";
    else 
        return "Don't know what happened, could have been sent. Why don't you check Trello?";
}

module.exports = {
    addCard
}