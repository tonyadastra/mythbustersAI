import { Avatar } from "@mui/material"

export const UserAvatar = ({ id, name = null, image, speaking, size = 100 }) => {
    return (
        <Avatar src={image} alt={name} id={id} sx={{
            width: size, height: size,
            ...(speaking ? { border: `4px solid #00BFFF` } : { border: `2px solid grey` })
        }} />
    )
}