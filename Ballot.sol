// SPDX-License-Identifier: MIT

pragma solidity >= 0.7.0 < 0.9.0;

// We want the ability to accept proposals and store them.
//proposal: their name, number

// voters and voting ability
// keep track of voting & check voters are authenticated to vote.

// chairman
// authenticate and deploy contract

// Why DApp?? why smart contract??
// decentralized database voting
// security = reduce manipulation


contract Ballot{
    
    // voters: voted, access to vote, vote index
    struct Voter{
        uint vote;
        bool voted;
        //To be implemented in future when necessary.
        uint weight;
    }

    struct Proposal{
        // name of each proposal, have a limit of 32 bytes to save gas
        bytes32 name; 

        // number of accumulated votes
        uint voteCount; 
    }

    //Array to store all the proposals
    Proposal[] public proposals;
    
    // mapping(address=>Voter) public voters; // voters get address as a key and Voter for value
    mapping(uint=>Voter) public idvoters; //voters get id as a key and Voter for value

    address public chairperson;

    constructor(bytes32[] memory proposalNames){
        //Assumption is that the chairperson sends proposal names at the start.
        chairperson=msg.sender;
        // voters[chairperson].weight=1;

        for(uint i=0;i<proposalNames.length;i++){
            proposals.push(Proposal({name:proposalNames[i],voteCount:0}));
        }
    }

    function voteAdmn(uint id, uint proposal) public{
        require(msg.sender==chairperson,'Not authorized to vote');
        Voter storage sender=idvoters[id];
        require(!sender.voted,'The voter has already voted');
        sender.weight=1;sender.voted=true;
        proposals[proposal].voteCount+=sender.weight;
    }

    // //Making sure that the chairperson is the only person who can give vote rights to voters. Function to authenticate user.
    // function giveRightToVote(address voter) public{
    //     require(
    //         msg.sender==chairperson,'Only the Chairperson can give the access'
    //     );
    //     require(!voters[voter].voted,'The voter has already voted');
    //     require(voters[voter].weight==0);

    //     voters[voter].weight=1;
    // }

    // // Sender just voted
    // function vote(uint proposal) public {
    //     Voter storage sender=voters[msg.sender];
    //     require(sender.weight!=0,'Has no right to vote');
    //     require(!sender.voted,'Already voted');
        
    //     sender.voted=true;sender.vote=proposal;

    //     proposals[proposal].voteCount+=sender.weight;
    // }

    //functions for sharing results
    
    // 1.function that shows the winning proposal by integer
    function winningProposal() public view returns (uint winningProposal_){
        uint winningVoteCount=0; 
        for(uint i=0;i<proposals.length;i++){
            if(proposals[i].voteCount>winningVoteCount){
                winningVoteCount=proposals[i].voteCount;
                winningProposal_=i;
            }
        }
    }
    // 2.function that shows the winning proposal by name
    function winningName() public view returns (bytes32 winningName_){
        winningName_=proposals[winningProposal()].name;
    }

    //string to bytes32
    //createBytes.js
    // const ethers=require('ethers')
    // async function createBytes(args){
    //    const name=args[0];const bytes=ethers.utils.formatBytes32String(name);console.log('name:',bytes);
    // }
    // createBytes(process.argv.slice(2));


    //bytes32 to string
    //parseBytes.js
    // const ethers=require('ethers')
    // async function parseBytes(args){
    //    const bytes=args[0];const name=ethers.utils.parseBytes32String(bytes);console.log('bytes:',name);
    // }
    // parseBytes(process.argv.slice(2));
}
