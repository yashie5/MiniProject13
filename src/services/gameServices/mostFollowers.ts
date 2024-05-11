import { supabase } from "@config/supabase";

async function mostFollowers(userID: number) {
    try {
        // Retrieve the list of users that the userID is following
        const { data: following, error: followingError } = await supabase
            .from('Followers')
            .select('Followed_Id')
            .eq('Following_Id', userID);

        if (followingError) throw followingError;

        // Retrieve the count of followers for each user that the userID is following
        const followerCounts = await Promise.all(
            following.map(async (follow) => {
                const { count, error } = await supabase
                    .from('Followers')
                    .select('count', { count: 'exact' })
                    .eq('Following_Id', follow.Followed_Id);

                if (error) throw error;

                return { user: follow.Followed_Id, count }; // Include count in the returned object
            })
        );

        // Find the user with the most followers,assuming this user has any followers
        const mostFollowedUser = followerCounts.reduce((prev, current) => (current.count > prev.count ? current : prev));

        // Choose 3 other random users from the following list
        const randomUsers = following.map(follow => follow.Followed_Id).filter(user => user !== mostFollowedUser.user).sort(() => 0.5 - Math.random()).slice(0, 3);

        // Combine the correct answer and the random users
        const answerChoices = [mostFollowedUser, ...randomUsers]; // Include follower count in the returned object

        return answerChoices;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export{mostFollowers};