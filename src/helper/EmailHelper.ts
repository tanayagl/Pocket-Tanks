export default class EmailHelper {
    public static videoShare(data) {
        data = JSON.parse(data);
        if (!data.parent_email) // Parent email is not set
            return;
        EmailHelper.sendRequestParse({
            type: 'ShareVideo',
            parent_email: data.parent_email,
            kid_name: data.kid_name,
            kid_gender: data.kid_gender,
            topic: data.topic,
            subtopic: data.subtopic,
            title: data.title,
            thumburl: data.thumburl,
            url: data.url
        });
    }
    public static waitList(data) {
        data = JSON.parse(data);
        if (!data.parent_email) // Parent email is not set
            return;
        EmailHelper.sendRequestParse({
            type: 'waitlist',
            parent_email: data.parent_email,
            kid_name: data.kid_name,
            kid_gender: data.kid_gender
        });
    }
    public static feedback(data) {
        data = JSON.parse(data);
        EmailHelper.sendRequest({
            type: 'feedback',
            parentEmail: data.parent_email,
            ContentID: data.ContentID,
            ContentTitle: data.title,
            ContentTopic: data.topic,
            ContentType: data.type,
            ContentSubTopic: data.subtopic,
            feedbackText: data.feedbackText
        });
    }
    public static gameScoreShare(data) {
        data = JSON.parse(data);
        if (!data.parent_email) // Parent email is not set
            return;
        EmailHelper.sendRequest({
            type: 'scoreShare',
            parentEmail: data.parent_email,
            subject: 'Share Score',
            score: data.score,
            gameLink: data.gameLink,
            gameName: data.gameName,
            thumbURL: data.thumbURL,
            topic: data.topic,
            kidAge: data.kidAge,
            kidName: data.kidName
        });
    }

    public static sendRequest(data: any, callback?: any) {
        var request = "https://brainbuilder.herokuapp.com/share/";
        if (data.type === 'scoreShare') {
            request += 'score';
        } else if (data.type === 'feedback') {
            request += 'feedback';
        }

        data = JSON.stringify(data);
        var xhrRequest = cc.loader.getXMLHttpRequest();
        xhrRequest.onerror = function (error) {
            cc.log("Error:" + error);
        };

        xhrRequest.open("POST", request);
        xhrRequest.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhrRequest.setRequestHeader("Cache-Control", "no-cache");
        xhrRequest.setRequestHeader("Content-Type", "application/json");
        xhrRequest.send(data);
    }
    public static sendRequestParse(data: any) {
        data = JSON.stringify(data);
        var xhrRequest = cc.loader.getXMLHttpRequest();
        xhrRequest.onerror = function (error) {
            cc.log("Error:" + error);
        };
        xhrRequest.open("POST", "https://api.parse.com/1/functions/sendEmail");
        xhrRequest.setRequestHeader("X-Parse-Application-Id", "2ZFXqLGVFM7n7T8h3Vjky9IJDBYf8lpQUR3KbeqS");
        xhrRequest.setRequestHeader("X-Parse-REST-API-Key", "N2MOGjAj8h4ti1dRVDBvH60UTd5rk7UmHnUQNJ9l");
        xhrRequest.setRequestHeader("Content-Type", "application/json");
        xhrRequest.send(data);
    }
}
