const metadata = (
    _description,
    _image_url,
    _name,
    _nullifier
) => {
    const metadata = 
    {
        pinataMetadata: {
            name: _name
        },
        pinataContent: {
            description: _description, 
            image: _image_url, 
            name: _name,
            nullifier: _nullifier
        }
    }

    return metadata
}

module.exports = { metadata }