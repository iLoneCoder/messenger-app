import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import messengerService from "./messengerService"

const initialState = {
    isLoading: false,
    isError: false,
    messageIsSaved: false,
    messageIsSeen: false,
    errorMessage: "",
    friends: [],
    messages: []
}

export const getFriends = createAsyncThunk("messenger/getFriends", async (_, thunkAPI) => {
    try {
        return await messengerService.getFriends()
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const sendMessage = createAsyncThunk("messenger/sendMessage", async (messageData, thunkAPI) => {
    try {
        return await messengerService.sendMessage(messageData)
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const getMessages = createAsyncThunk("messenger/getMessages", async (receiverData, thunkAPI) => {
    try {
        return await messengerService.getMessages(receiverData)
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const sendImage = createAsyncThunk("messenger/sendImage", async (imageData, thunkAPI) => {
    try {
        return await messengerService.sendImage(imageData)
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const messageStatusToSeen = createAsyncThunk("messenger/changeToSeen", async (messageData, thunkAPI) => {
    try {
        return await messengerService.changeToSeen(messageData)
    } catch (error) {
        const message = error.response.data.message

        return thunkAPI.rejectWithValue(message)
    }
})

export const updateMyLastMessage = createAsyncThunk("messenger/updateMyLastMessage", (friendIdAndMessage) => {
    return friendIdAndMessage
})

export const updateFriendsLastMessage = createAsyncThunk("messenger/updateFriendsLastMessage", (senderIdAndMessage) => {
    return senderIdAndMessage
})

//putting received messages in messages
export const receiveSocketMessage = createAsyncThunk("messenger/receiveSocketMessage", (messageData, thunkAPI) => {
    return messageData
})

export const setInitialValueForMessageIsSaved = createAsyncThunk("messenger/setInitialValueForMessageIsSaved", (_, thunkAPI) => {
    return false
})

export const friendHasSeenMessage = createAsyncThunk("messenger/friendHasSeenMessage", (friendId, thunkAPI) => {
    return friendId
})

export const logout = createAsyncThunk("messenger/logout", (_, thunkAPI) => {
    return
})

const messengerSlice = createSlice({
    initialState,
    name: "messenger",
    reducers: {},
    extraReducers: (builder) => {
        builder
            //getting friends list
            .addCase(getFriends.pending, state => {
                state.isLoading = true
            })
            .addCase(getFriends.fulfilled, (state, action) => {
                state.isLoading = false
                state.friends = action.payload.friends
            })
            .addCase(getFriends.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.errorMessage = action.payload
            })
            //pushing new message into messages
            .addCase(sendMessage.pending, state => {
                state.isLoading = true
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.messageIsSaved = action.payload.success
                state.messages = [...state.messages, action.payload.message]
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false
                state.errorMessage = action.payload
            })
            //getting messages
            .addCase(getMessages.pending, state => {
                state.isLoading = true
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.messages = action.payload
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.errorMessage = action.payload
            })
            //pushing new image into messages
            .addCase(sendImage.pending, state => {
                state.isLoading = true
            })
            .addCase(sendImage.fulfilled, (state, action) => {
                state.isLoading = false
                state.messageIsSaved = action.payload.success
                state.messages = [...state.messages, action.payload.message]
            })
            .addCase(sendImage.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.errorMessage = action.payload
            })
            //putting received messages in messages
            .addCase(receiveSocketMessage.fulfilled, (state, action) => {
                state.messages = [...state.messages, action.payload]
            })
            //set initial value to messageIsSaved 
            .addCase(setInitialValueForMessageIsSaved.fulfilled, (state, action) => {
                state.messageIsSaved = action.payload
            })
            //update my last message
            .addCase(updateMyLastMessage.fulfilled, (state, action) => {
                const { receiverId: friendId } = action.payload
                const index = state.friends.findIndex(fd => fd.friendInfo._id === friendId)

                if (index !== -1) {
                    state.friends[index].lastMessage = action.payload
                }
            })
            //update friend's last message
            .addCase(updateFriendsLastMessage.fulfilled, (state, action) => {
                const { senderId } = action.payload
                const index = state.friends.findIndex(fd => fd.friendInfo._id === senderId)
                if (index !== -1) {
                    state.friends[index].lastMessage = action.payload
                }
            })
            //update message status to seen
            .addCase(messageStatusToSeen.pending, state => {
                state.isLoading = true
            })
            .addCase(messageStatusToSeen.fulfilled, (state, action) => {
                state.isLoading = false
                const index = state.friends.findIndex(fd => fd.friendInfo._id === action.payload.message.senderId)
                // console.log(action.payload)
                // console.log(state.friends[0].friendInfo._id,action.payload.message.senderId)
                if (index !== -1) {

                    state.friends[index].lastMessage = action.payload.message
                    state.messageIsSeen = true
                }
            })
            .addCase(messageStatusToSeen.rejected, (state, action) => {
                state.isLoading = false
                state.errorMessage = action.payload
            })
            //to get notified when friend sees message
            .addCase(friendHasSeenMessage.fulfilled, (state, action) => {
                console.log(action.payload)
                const index = state.friends.findIndex(fd => fd.friendInfo._id === action.payload)
                if (index !== -1) {
                    state.friends[index].lastMessage.status = "seen"
                }
            })
            //clear friends and messages lists after logging out
            .addCase(logout.fulfilled, state => {
                state.friends = []
                state.messages = []
            })
    }
})

export default messengerSlice.reducer