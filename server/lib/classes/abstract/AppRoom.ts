import { simpleUUID } from "../../utils/methods/generalHelpers";

abstract class AppRoom<T> {
    public id: string;
    public openToJoin: boolean;
    public users: T[];

    constructor({ users, openToJoin }: { users: T[]; openToJoin: boolean }) {
        this.id = simpleUUID(10);
        this.users = users;
        this.openToJoin = openToJoin;
    }

    abstract addUser(user: T): void;

    abstract closeToNewcomers(): void;
}

export default AppRoom;
