const SurveyCoin = artifacts.require("SurveyCoin.sol");

async function shouldThrow(promise) {
    try {
        await promise;
        assert(true);
    }
    catch (err) {
        return;
    }
    assert(false, "The contract did not throw.");
}    

contract("SurveyCoin", async addresses => {
    const [admin, user1, user2, user3, user4, _] = addresses;
    let surveycoin = null;
    let adminSurvey1 = null;

    it('Survey Coin mint for contract deployment', async () => {
        surveycoin = await SurveyCoin.new("SurveyCoin", "SYC");
        const balanceOfDeployer = await surveycoin.balanceOf(admin);
        assert(balanceOfDeployer.toString() === "1000000", "Balance of deployer is incorrect: " + balanceOfDeployer);
    });

    it('Survey Coin create survey coin burn', async () => {
        adminSurvey1 = await surveycoin.createSurvey("survey1");
        adminSurvey1 = adminSurvey1.logs[0].args.surveyid.toString();

        let ownerSurveyCount = await surveycoin.getOwnerSurveyCount(admin);
        assert(ownerSurveyCount.toString() === "1", "ownerSurveyCount is not correct: " + ownerSurveyCount);

        await surveycoin.createSurvey("survey2");
        await surveycoin.createSurvey("survey3");
        await surveycoin.createSurvey("survey4");
        await surveycoin.createSurvey("survey5");

        ownerSurveyCount = await surveycoin.getOwnerSurveyCount(admin);
        assert(ownerSurveyCount.toString() === "5", "ownerSurveyCount is not correct: " + ownerSurveyCount);

        await surveycoin.createSurvey("survey6");
        ownerSurveyCount = await surveycoin.getOwnerSurveyCount(admin);
        assert(ownerSurveyCount.toString() === "6", "ownerSurveyCount is not correct: " + ownerSurveyCount);
        
        let balance = await surveycoin.balanceOf(admin);
        assert(balance.toString() === "999999", "Balance is not correct" + balance);
    });
    
    it('Not enough balance to burn', async () => {
        await surveycoin.createSurvey("user1Survey1", {from: user1});

        let user1SurveyCount = await surveycoin.getOwnerSurveyCount(user1);
        assert(user1SurveyCount.toString() === "1", "user1SurveyCount is not correct: " + user1SurveyCount);

        await surveycoin.createSurvey("user1Survey2", {from: user1});
        await surveycoin.createSurvey("user1Survey3", {from: user1});
        await surveycoin.createSurvey("user1Survey4", {from: user1});
        let result = await surveycoin.createSurvey("user1Survey5", {from: user1});
        let surveyid = result.logs[0].args.surveyid.toString();
        assert(surveyid === "10", "Survey ID is not correct: " + surveyid);
        await shouldThrow(surveycoin.createSurvey("user1Survey6", {from: user1}));
    });

    it('Answer Survey Once', async () => {
        let result = await surveycoin.answerSurvey(parseInt(adminSurvey1), {from: user2});
        assert(result.logs[0].args.value.toString() === "1");
    });

    it('Answer Survey Twice', async () => {
        await shouldThrow(surveycoin.answerSurvey(parseInt(adminSurvey1), {from: user2}));
        assert(true);
    });

    it('Responder should have new minted coin', async () => {
        let user2balance = await surveycoin.balanceOf(user2);
        assert(user2balance.toString() === "1", "Balance is incorrect, should be: " + user2balance.toString());
    });

    it('Response count should work', async () => {
        let responseCount = await surveycoin.getResponseCount(parseInt(adminSurvey1));
        assert(responseCount.toString() === "1", "Response count is incorrect, should be: " + responseCount.toString());
    });

    it('Get all titles of survey', async () => {
        let surveyTitles = await surveycoin.getAllSurveyTitlesByOwner(admin);

        assert(surveyTitles.length === 6, "Invalid number of survey titles: " + surveyTitles.length.toString());
        assert(surveyTitles[0] === "survey1", "Survey 1 incorrect name: " + surveyTitles[0]);
        assert(surveyTitles[1] === "survey2", "Survey 2 incorrect name: " + surveyTitles[1]);
        assert(surveyTitles[2] === "survey3", "Survey 3 incorrect name: " + surveyTitles[2]);
        assert(surveyTitles[3] === "survey4", "Survey 4 incorrect name: " + surveyTitles[3]);
        assert(surveyTitles[4] === "survey5", "Survey 5 incorrect name: " + surveyTitles[4]);
        assert(surveyTitles[5] === "survey6", "Survey 6 incorrect name: " + surveyTitles[5]);
    });
});