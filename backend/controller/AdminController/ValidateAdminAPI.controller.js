import User from "../../models/users.model.js"
export const ValidateAdminAPI = async (req, res) => {
    try {
        const { email } = await req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "You Don't have admin access. Please contact support." });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ success: false, message: "You Don't have admin access. Please contact support." });
        }

        return res.json({ success: true, message: `Welcome back, ${user.fullName}!` })
    } catch (error) {
        return res.json({ success: false, message: "Validate Admin API failed", error_message: error.message })
    }
}