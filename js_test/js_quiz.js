
// Define the start and stop const strings
const START_ACTION = "start";
const STOP_ACTION = "stop";


/**
 * Get users which did this action in the time window.
 * 
 * @param {Array} records Input records.
 * @param {string} action start or stop action.
 * @param {number} start_time start time of time window.
 * @param {number} end_time end time of time window.
 * @returns {array} Array of user_id in this time window.
 */
function getUsers(records, action, start_time, end_time){
    // Step 1: Arguments check
    if (!Array.isArray(records))
        throw new Error("records argument is not array");

    if (action !== START_ACTION && action !== STOP_ACTION)
        throw new Error(`action can only be ${START_ACTION} or ${STOP_ACTION}`);

    if (typeof start_time != "number")
        throw new Error("start_time argument is not number");

    if (typeof end_time != "number")
        throw new Error("end_time argument is not number");

    if (end_time <= start_time)
        throw new Error("end_time must be greater than start_time");

    // Step 2: Iterate all records and find the matching action within the time window. 
    // To avoid duplicate, the user_ids are stored in a set
    let foundUserIds = new Set();
    for (let i = 0; i < records.length; i++){
        e = records[i];

        // Check property of records
        if (e.user_id === undefined)
            throw new Error(`user_id is not found in record ${i}`);

        if (e.device === undefined)
            throw new Error(`device is not found in record ${i}`);
            
        if (e.action !== START_ACTION && e.action !== STOP_ACTION)
            throw new Error(`action is not found in record ${i}, or action is not "start" or "stop"`);
        
        if (e.date_actioned === undefined)
            throw new Error(`date_actioned is not found in record ${i}`);

        // Same action, the time of action is within the time window, record in the set
        if ((e.action === action) && (e.date_actioned >= start_time) && (e.date_actioned <= end_time)){
            if (!foundUserIds.has(e.user_id)){
                foundUserIds.add(e.user_id);
            }
        }
    }

    // Step 3: Convert the set to array
    const userIds = Array.from(foundUserIds);
    return userIds;
}

/**
 * Get the playback time of a particular user.
 * If there's any overlap time duration between different devices, the combined time should be got.
 * 
 * @param {number} user_id The user_id which the playback time will be got.
 * @param {array} records Record array.
 * @returns {number}
 */
function getPlaybackTime(user_id, records)
{
    // Step 1: Arguments check
    if (typeof user_id != "number")
        throw new Error(`user_id argument is not number`);
    
    if (!Array.isArray(records))
        throw new Error("records argument is not array");

    // Step 2: Find the actions of this user_id and store in a object
    let userActions = {};
    for (let i = 0; i < records.length; i++){
        e = records[i];

        // Check property of records
        if (e.user_id === undefined)
            throw new Error(`user_id is not found in record ${i}`);

        if (e.device === undefined)
            throw new Error(`device is not found in record ${i}`);
            
        if (e.action !== START_ACTION && e.action !== STOP_ACTION)
            throw new Error(`action is not found in record ${i}, or action is not "start" or "stop"`);
        
        if (e.date_actioned === undefined)
            throw new Error(`date_actioned is not found in record ${i}`);

        // Found this user_id
        if (e.user_id == user_id){
            if (!(e.device in userActions)){
                userActions[e.device] = {}
            }

            // Record the start time or end time
            if (e.action === START_ACTION){
                userActions[e.device].start = e.date_actioned;
            } else {
                userActions[e.device].end = e.date_actioned;
            }
        }
    }

    // Step 3: Store the time durations into an array and sort
    const timeDurations = [];
    for (const device in userActions) {
        const deviceTime = userActions[device];
        // Ignore this record if start or stop is not found.
        if (deviceTime.start !== undefined && deviceTime.end !== undefined){
            timeDurations.push(deviceTime);
        }
    }

    // Sort time durations based on start time in accending order.
    // Sorting the time durations simplifies the combine process.
    timeDurations.sort((a, b) => { return a.start - b.start; })

    // Step 4: Combine the durations if there's overlap
    const combinedDurations = [];
    timeDurations.forEach(deviceTime => {
        // Iterate combined durations to check whether there's overlap
        let foundOverlap = false;
        combinedDurations.forEach(d => {
            if (deviceTime.start >= d.start && deviceTime.start <= d.end){
                // Intersection occurres, combine them
                d.end = deviceTime.end;
                foundOverlap = true;
            }
        });

        // If no overlap found, push this duration
        if (!foundOverlap){
            combinedDurations.push({start:deviceTime.start, end:deviceTime.end});
        }
    });

    // Step 5: Calculate total time
    let totalTime = 0;
    combinedDurations.forEach(deviceTime => {
        totalTime += deviceTime.end - deviceTime.start;
    });

    return totalTime;
}


// Export the functions
exports.getUsers = getUsers;
exports.getPlaybackTime = getPlaybackTime;
