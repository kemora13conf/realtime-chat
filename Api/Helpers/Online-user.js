export default class OnlineUsers{
    static users = [];
    static addUser(user) {
        // check if the user already exists
        const userExist = this.users.find(u => u.userId === user.userId);
        if (userExist) {
            // update the user socket id
            this.users = this.users.map(u => {
                if (u.userId === user.userId) {
                    u.socketId = user.socketId;
                }
                return u;
            });
        } else {
            // add the user to the list
            this.users.push(user);
        }
    }
    static removeUserById(userId){
        this.users = this.users.filter(user => user.userId !== userId);
    }
    static removeUserBySocketId(socketId){
        this.users = this.users.filter(user => user.socketId !== socketId);
    }
    static getUserById(userId) {
        return this.users.find(user => user.userId === userId);
    }
    static getUserBySocketId(socketId){
        return this.users.find(user => user.socketId === socketId);
    }
    static getUsers(){
        return this.users;
    }
    static isOnline(userId){
        return this.users.some(user => user.userId === userId);
    }
}