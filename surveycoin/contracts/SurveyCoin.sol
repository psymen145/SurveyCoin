pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract SurveyCoin is ERC20 {

    using SafeMath for uint;

    event NewSurvey(uint surveyid, string name, address creator);
    event NewResponse(uint numAnswers);

    struct Survey {
        string name;
        uint numberOfAnswers;
        mapping (address => bool) addressAnswered;
    }

    uint numSurveys;
    mapping (uint => Survey) surveys;
    mapping (uint => address) surveyToOwner;
    mapping (address => uint[]) surveysByOwner;
    mapping (address => uint) ownerSurveyCount;

    constructor(string memory _name, string memory _symbol) ERC20 (_name, _symbol) {
        _mint(msg.sender, 1000000);
    }

    function createSurvey(string memory _name) external {
        if(ownerSurveyCount[msg.sender] >= 5){
            require(balanceOf(msg.sender) >= 1);
        }

        uint id = numSurveys++;
        // memory - structs w/ mappings cannot be created in solidity > 0.7 (Survey(_name, 0))
        Survey storage s = surveys[id];
        s.name = _name;
        s.numberOfAnswers = 0;

        surveysByOwner[msg.sender].push(id);

        ownerSurveyCount[msg.sender]++; 
        if (ownerSurveyCount[msg.sender] > 5) {
            _burn(msg.sender, 1);
        }

        emit NewSurvey(id, _name, msg.sender);
    }

    function answerSurvey(uint surveyID) external {
        // cannot answer own survey
        require(msg.sender != surveyToOwner[surveyID] && surveyID >= 0);

        // require one answer
        Survey storage s = surveys[surveyID];
        require(!s.addressAnswered[msg.sender]);

        s.addressAnswered[msg.sender] = true;
        s.numberOfAnswers++;

        _mint(msg.sender, 1);

        emit NewResponse(s.numberOfAnswers);
    }

    function getOwnerSurveyCount(address owner) external view returns (uint) {
        return ownerSurveyCount[owner];
    }

    function getResponseCount(uint surveyID) external view returns (uint) {
        require(surveyID >= 0);
        Survey storage s = surveys[surveyID];
        return s.numberOfAnswers;
    }

    function getAllSurveyTitlesByOwner(address owner) external view returns (string[] memory) {
        string[] memory titles = new string[](surveysByOwner[owner].length);

        for (uint i=0; i<surveysByOwner[owner].length; i++){
            uint surveyID = surveysByOwner[owner][i];
            titles[i] = surveys[surveyID].name;
        }

        return titles;
    }
}