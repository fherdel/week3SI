const messagesService = require("../services/messagesService");

test("returns an array type when getting messages", () => {
  expect(messagesService.getMessagesHistory()).toEqual([]);
});

test("appends new object to message history", () => {
  const sampleMessageObject = {
    userName: "sample user",
    message: "sample message",
  };

  expect(messagesService.getMessagesHistory().length).toEqual(0);
  messagesService.addToMessageHistory(sampleMessageObject);

  const messages = messagesService.getMessagesHistory();
  expect(messages.length).toEqual(1);
  const latestMessage = messages.pop();
  expect(latestMessage.userName === sampleMessageObject.userName).toBe(true);
  expect(latestMessage.message === sampleMessageObject.message).toBe(true);
});

