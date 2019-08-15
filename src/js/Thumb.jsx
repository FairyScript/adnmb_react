import React, { useState } from 'react';

function Thumb(props) {
    const [loading, setLoading] = useState(false);
    const [thumb, setThumb] = useState(undefined);

    const file = props.file;

    if (!file) { return null; }

    if (loading) { return <p>loading...</p>; }

    let reader = new FileReader();

    reader.onloadend = () => {
        setLoading(false);
        setThumb(reader.result);
    };

    reader.readAsDataURL(file);

    return (
        <img src={thumb}
            alt={file.name}
            className="img-thumbnail"
            height={200}
            width={200} />
    )
}


export { Thumb };