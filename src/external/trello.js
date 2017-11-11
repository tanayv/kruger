module.exports = {
    addCard: function(title, desc, due, list) {

        if (list = 'hw')
            listID = 'wdsP3KuR';
        else if (list = 'side')
            listID = 'B1ajtkHs';

        var options = { 
            method: 'POST',
            url: 'https://api.trello.com/1/cards',
            key: '6663212c465dd85d568ed53171ab4619',
            token: '191e775a7e6ee058ae9c6af6b7b7294409bbfc0e3cbcd61508ab68e75e3476d3',
        };

        var body = {
            title: title, 
            desc: desc,
            due: due,
            idList: listID
        }
        
        request(options, function (error, response, body) {
          return response;
          console.log(body);
        });
        
    }
};