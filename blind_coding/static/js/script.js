function getLeaderboard() {
    $.ajax({
        url : "http://127.0.0.1:8000/leaderboard/",
        type : "GET",
        beforeSend : function() {
            document.getElementById('leaderboard-loader').style.display = 'block';
        },
        success : function(jsondata) {
            var objRecieved = jQuery.parseJSON(JSON.stringify(jsondata));
            let template = document.getElementById("leaderboard-row");
            document.getElementById('leaderboard-loader').style.display = 'none';
            for (var i = 0; i < objRecieved.username.length; ++i) {
                let clone = template.content.cloneNode(true);
                document.getElementById('leaderboard-body').appendChild(clone);
                document.getElementsByClassName('rank')[i+2].innerHTML = i+1; //Get Array of Username's here
                document.getElementsByClassName('name')[i+2].innerHTML = objRecieved.username[i]; //Get Array of Username's here
                document.getElementsByClassName('score')[i+2].innerHTML = objRecieved.score[i]; //Get Array of Score's here
            }
            document.getElementById('userRank').innerHTML = 'Your Rank : ' + objRecieved.rank;
            document.getElementById('myrank').innerHTML = objRecieved.rank;
        },
        error : function() {
            console.log("Error");
        }
    })
}