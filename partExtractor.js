_.mixin(_.str.exports());

$(document).ready(function () {
    let partMap = getPartMap();

    let selection =
    {
        sex:
        {
            male: "",
            female: "",
        },
        body:
        {
            //dark: "",
            dark2: "",
            //darkelf: "",
            //darkelf2: "",
            light: "",
            //tanned: "",
            //tanned2: "",
        },
        legs:
        {
            //pants_magenta: "",
            pants_red: "",
            pants_teal: "",
            pants_white: "",
            //robe_skirt: "",
        },
        clothes:
        {
            dress_sash: "",
            longsleeve_brown: "",
            //longsleeve_maroon: "",
            longsleeve_teal: "",
            longsleeve_white: "",
            //sleeveless_brown: "",
            //sleeveless_maroon: "",
            //sleeveless_teal: "",
            //sleeveless_white: "",
            tunic_brown: "",
            //tunic_maroon: "",
            tunic_teal: "",
            tunic_white: "",
        },
        /*
        jacket:
        {
            none: "",
            tabard: "",
        },
        */
        shoes:
        {
            shoes_black: "",
            //shoes_brown: "",
            //shoes_maroon: "",
        },
        hair:
        {
            plain_blonde: "",
            plain_brunette: "",
            plain_raven: "",
            plain_dark_blonde: "",
            bedhead_blonde: "",
            bedhead_brunette: "",
            bedhead_raven: "",
            long_blonde: "",
            long_brunette: "",
            long_raven: "",
            messy1_blonde: "",
            messy1_brunette: "",
            messy1_raven: "",
            mohawk_blonde: "",
            mohawk_brunette: "",
            mohawk_raven: "",
            page_blonde: "",
            page_brunette: "",
            page_raven: "",
            parted_blonde: "",
            parted_brunette: "",
            parted_raven: "",
            loose_black: "",
            loose_blonde2: "",
            loose_brown: "",
            loose_brunette: "",
            //loose_brunette2: "",
            loose_dark_blonde: "",
            loose_raven: "",
            //pixie_black: "",
            //pixie_blonde2: "",
            //pixie_brown: "",
            //pixie_brunette: "",
            //pixie_brunette2: "",
            //pixie_dark_blonde: "",
            //pixie_raven: "",
            bangslong2_black: "",
            bangslong2_blonde2: "",
            bangslong2_brown: "",
            bangslong2_brunette: "",
            //bangslong2_brunette2: "",
            bangslong2_dark_blonde: "",
            bangslong2_raven: "",
            ponytail2_black: "",
            ponytail2_blonde2: "",
            ponytail2_brown: "",
            ponytail2_brunette: "",
            //ponytail2_brunette2: "",
            ponytail2_dark_blonde: "",
            ponytail2_raven: "",
            bunches_black: "",
            bunches_blonde2: "",
            bunches_brown: "",
            bunches_brunette: "",
            //bunches_brunette2: "",
            bunches_dark_blonde: "",
            bunches_raven: "",
            princess_black: "",
            princess_blonde2: "",
            princess_brown: "",
            princess_brunette: "",
            //princess_brunette2: "",
            princess_dark_blonde: "",
            princess_raven: "",
            //shoulderl_black: "",
            //shoulderl_blonde2: "",
            //shoulderl_brown: "",
            //shoulderl_brunette: "",
            //shoulderl_brunette2: "",
            //shoulderl_dark_blonde: "",
            //shoulderl_raven: "",
            //shoulderr_black: "",
            //shoulderr_blonde2: "",
            //shoulderr_brown: "",
            //shoulderr_brunette: "",
            //shoulderr_brunette2: "",
            //shoulderr_dark_blonde: "",
            //shoulderr_raven: "",
        },
    }

    let selectedParts = getSelectionOfObject(partMap, selection);

    console.log(selectedParts);

    console.log(getUsedPartsInOrder(selectedParts));

    let permutations = getAllPermutations(selectedParts);


    let permutatedCharacters = permutations.map(p => getCharacterFromPermutation(p, selectedParts));
    let validCharacters = permutatedCharacters.filter(c => isValidCharacter(c));
    let flattenedCharacters = validCharacters.map(c => flattenCharacter(c));

    console.log(flattenedCharacters);

    
    let i = 1;
    drawNextCharacter = () =>
    {
        let character = flattenedCharacters[i];
        window.setTimeout(() => {
            jHash.val(character);
            
            window.setTimeout(() => {
                let canvas = $("#spritesheet").get(0);
                let imageBase64 =  Canvas2Image.saveAsPNG(canvas);
		        $('#dowloadLinkBox').append(imageBase64 + "\n");
                
                console.log("done " + i);
                i+=6;
                if(i < flattenedCharacters.length) window.setTimeout(drawNextCharacter, 0, false);
                else console.log("Done");
            }, 50, false);
        }, 0, false);
    }

    drawNextCharacter();

});

function flattenCharacter(character)
{
    return Object.keys(character).reduce((obj, property) =>
    {
        obj[property] = character[property].value;
        return obj;
    }, {});
}

function getPartMap() {
    let options = [...document.querySelectorAll("#chooser > ul input")];

    let partMap = {};

    options.forEach(option => {
        let id = option.id;
        let splitId = id.split("-");
        let type = splitId[0];
        let value = splitId[1];
        let part = { value };
        let conditionField = option.attributes["data-required"];
        let prohibitedField = option.attributes["data-prohibited"];

        if (conditionField) part.condition = getConditionObject(conditionField.value);
        if (prohibitedField) part.condition = getConditionObject(prohibitedField.value);


        if (!partMap[type]) partMap[type] = {};

        partMap[type][value] = part;
    });

    return partMap;
}

function getPartOrder() {
    return [...document.querySelectorAll("#chooser > ul > li > span")].map(item => item.innerHTML.toLowerCase())
}

function getUsedPartsInOrder(objectDescriptor)
{
    return getPartOrder().filter(part => objectDescriptor[part]);
}

function getConditionObject(conditionString) {
    condition = [];

    let rules = conditionString.split(",");
    rules.forEach(rule => {
        [property, value] = rule.split("=");
        condition.push({ property, value });
    });

    return condition;
}



function getCharacterFromPermutation(permutation, objectDescriptor)
{
    let character = {};
    Object.keys(permutation).forEach(part => 
    {
        let partgroup = objectDescriptor[part];
        if(!partgroup) return;
        
        let partname = Object.keys(partgroup)[permutation[part]];
        character[part] = partgroup[partname];
    });
    return character;
}

function getAllPermutations(objectDescriptor)
{
    let partOrder = getUsedPartsInOrder(objectDescriptor);

    console.log(partOrder.map(part => Object.keys(objectDescriptor[part]).length).reduce((a, b) => a * b, 1));

    let startPermutation = partOrder.reduce((obj, x) => { 
        obj[x] = 0; 
        return obj; 
    }, {});


    let permutations = [];
    getPermutations(permutations, objectDescriptor, startPermutation, 0, partOrder);
    return permutations;
}

function getPermutations(outPermutations, objectDescriptor, currentPermutation, permutationIndex, partOrder)
{
    if(permutationIndex >= partOrder.length)
    {
        outPermutations.push(currentPermutation);
        return;
    }

    let currentPermutationProperty = partOrder[permutationIndex];
    let partCount = Object.keys(objectDescriptor[currentPermutationProperty]).length
    for(let i = 0; i < partCount; i++)
    {
        let nextPermutation = JSON.parse(JSON.stringify(currentPermutation));
        nextPermutation[currentPermutationProperty] = i;
        getPermutations(outPermutations, objectDescriptor, nextPermutation, permutationIndex+1, partOrder);
    }
}

function isValidCharacter(character)
{
    let characterProperties = Object.keys(character)
    
    return characterProperties.every(property =>
    {
        let part = character[property];
        return !part.condition || part.condition.every(condition => checkCondition(character, condition));
    });
}

function checkCondition(character, condition)
{
    return character[condition.property].value === condition.value;
}

function getSelectionOfObject(object, selection) {
    let selectedObject = {};

    Object.keys(selection).forEach(key => {
        if (Object.keys(selection[key]).length > 0) {
            selectedObject[key] = getSelectionOfObject(object[key], selection[key]);
        }
        else {
            selectedObject[key] = object[key];
        }
    });

    return selectedObject;
}