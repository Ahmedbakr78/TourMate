import { IRequest } from "../../../common/index.js";
import { driverModel, driverRepository, guideModel, guideRepository, lostItemModel, lostItemRepository, placeModel, placeRepository, reviewModel, reviewRepository, tripModel, tripRepository, userModel, userRepository, voteModel, voteRepository } from "../../../db/index.js";


class adminService {

    private userRepo = new userRepository(userModel);
    private tripRepo = new tripRepository(tripModel);
    private placeRepo = new placeRepository(placeModel);
    private reviewRepo = new reviewRepository(reviewModel);
    private voteRepo = new voteRepository(voteModel);
    private guideRepo = new guideRepository(guideModel);
    private driverRepo = new driverRepository(driverModel);
    private lostItemRepo = new lostItemRepository(lostItemModel);

    dashboard = async (req: IRequest, res: Response) => {

        // const [
        //     totalUsers, totalTrips, totalPlaces, totalReviews,
        //     totalVotes, totalGuides, totalDrivers, totalLostItems
        // ] = await Promise.all([

        //     this.userRepo.countDocuments(),
        //     this.tripRepo.countDocuments(),
        //     this.placeRepo.countDocuments(),
        //     this.reviewRepo.countDocuments(),
        //     this.voteRepo.countDocuments(),
        //     this.guideRepo.countDocuments(),
        //     this.driverRepo.countDocuments(),
        //     this.lostItemRepo.countDocuments()
        // ]);

        // return res.json(successResponse("Dashboard fetched successfully", 200, {
        //     totalUsers,
        //     totalTrips,
        //     totalPlaces,
        //     totalReviews,
        //     totalVotes,
        //     totalGuides,
        //     totalDrivers,
        //     totalLostItems
        // }));
    };


}

export default new adminService();