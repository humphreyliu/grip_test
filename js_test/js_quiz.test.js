const js_quiz = require('./js_quiz')

//////////////////////////////////////////////
// Tests of getUsers
//////////////////////////////////////////////

//// Arguments tests
// Test records
test('"records" argument must be array', () => {
    expect(() => {
        js_quiz.getUsers();
    }).toThrowError('records argument is not array');
});

// Test action
test('"action" can only be "start" or "stop"', () => {
    expect(() => {
        js_quiz.getUsers([], "wrongAction");
    }).toThrowError(/[start|stop]/);
});

// Test start_time
test('"start_time" argument must be number', () => {
    expect(() => {
        js_quiz.getUsers([], "start", "");
    }).toThrowError('start_time argument is not number');
});

// Test end_time
test('"end_time" argument must be number', () => {
    expect(() => {
        js_quiz.getUsers([], "start", 100, "");
    }).toThrowError('end_time argument is not number');
});

test('"end_time" must be greater than "start_time"', () => {
    expect(() => {
        js_quiz.getUsers([], "start", 100, 90);
    }).toThrowError('end_time must be greater than start_time');
});

// Test property of record elements
test('"user_id" must be in the element', () => {
    expect(() => {
        js_quiz.getUsers([{}], "start", 100, 200);
    }).toThrowError('user_id is not found in record');
});

test('"device" must be in the element', () => {
    expect(() => {
        js_quiz.getUsers([{user_id:1}], "start", 100, 200);
    }).toThrowError('device is not found in record');
});

test('"action" must be in the element', () => {
    expect(() => {
        js_quiz.getUsers([{user_id:1, device:"OSX 15.4"}], "start", 100, 200);
    }).toThrowError('action is not found in record');
});

test('"date_actioned" must be in the element', () => {
    expect(() => {
        js_quiz.getUsers([{user_id:1, device:"Windows 10", action:"start"}], "start", 100, 200);
    }).toThrowError('date_actioned is not found in record');
});


//// Function tests
const records = [
    {user_id: 1, device: "Windows 10", action: "start", date_actioned: 100},
    {user_id: 2, device: "OSX 15.4", action: "start", date_actioned: 200},
    {user_id: 1, device: "iPhone 8s", action: "start", date_actioned: 250},
    {user_id: 1, device: "Windows 10", action: "stop", date_actioned: 370},
    {user_id: 1, device: "iPhone 8s", action: "stop", date_actioned: 410},
    {user_id: 2, device: "OSX 15.4", action: "stop", date_actioned: 490},
    {user_id: 3, device: "Android 9.1", action: "start", date_actioned: 700}
];

test('It should return [3]', () => {
    expect(js_quiz.getUsers(records, "start", 700, 900)).toEqual([3]);
});

test('It should return [1, 2]. The case of some users are in the time window.', () => {
    expect(js_quiz.getUsers(records, "start", 100, 300)).toEqual([1, 2]);
});

test('It should return []. The case of no user in the time window.', () => {
    expect(js_quiz.getUsers(records, "start", 0, 50)).toEqual([]);
});

test('It should return [1, 2, 3]. The case of all users are in the time window.', () => {
    expect(js_quiz.getUsers(records, "start", 0, 1000)).toEqual([1, 2, 3]);
});

//////////////////////////////////////////////
// Tests of getPlaybackTime
//////////////////////////////////////////////
//// Arguments tests
// Test user_id
test('"user_id" argument must be number', () => {
    expect(() => {
        js_quiz.getPlaybackTime("");
    }).toThrowError('user_id argument is not number');
});

// Test records
test('"records" argument must be array', () => {
    expect(() => {
        js_quiz.getPlaybackTime(1);
    }).toThrowError('records argument is not array');
});

// Test property of record elements
test('"user_id" must be in the element', () => {
    expect(() => {
        js_quiz.getPlaybackTime(1, [{}]);
    }).toThrowError('user_id is not found in record');
});

test('"device" must be in the element', () => {
    expect(() => {
        js_quiz.getPlaybackTime(1, [{user_id:1}]);
    }).toThrowError('device is not found in record');
});

test('"action" must be in the element', () => {
    expect(() => {
        js_quiz.getPlaybackTime(1, [{user_id:1, device:"Windows 10"}]);
    }).toThrowError('action is not found in record');
});

test('"date_actioned" must be in the element', () => {
    expect(() => {
        js_quiz.getPlaybackTime(1, [{user_id:1, device:"OSX 15.4", action:"start"}]);
    }).toThrowError('date_actioned is not found in record');
});

//// Function tests
test('It should return 310. The case of only one combined time duration.', () => {
    expect(js_quiz.getPlaybackTime(1, records)).toEqual(310);
});

test('It should return 0, if the user is not found', () => {
    expect(js_quiz.getPlaybackTime(0, records)).toEqual(0);
});

test('It should return 0, if the user does not have a start or stop time', () => {
    expect(js_quiz.getPlaybackTime(3, records)).toEqual(0);
});


const records_2 = [
    {user_id: 1, device: "Windows 10", action: "start", date_actioned: 100},
    {user_id: 2, device: "OSX 15.4", action: "start", date_actioned: 200},
    {user_id: 1, device: "iPhone 8s", action: "start", date_actioned: 400}, // this date is different from records
    {user_id: 1, device: "Windows 10", action: "stop", date_actioned: 370},
    {user_id: 1, device: "iPhone 8s", action: "stop", date_actioned: 410},
    {user_id: 2, device: "OSX 15.4", action: "stop", date_actioned: 490},
    {user_id: 3, device: "Android 9.1", action: "start", date_actioned: 700}
];

test('It should return 280. The case of multi combined time durations.', () => {
    expect(js_quiz.getPlaybackTime(1, records_2)).toEqual(280);
});


