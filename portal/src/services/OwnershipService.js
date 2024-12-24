class OwnershipService {
    
    static getNoteOwnership = (owner) => {
        let current_user = sessionStorage.getItem('User_Email');
        if(owner === current_user){
            return true;
        } else {
            return false;
        }
    }
}


export default OwnershipService;