export const pagination = ({
    page = 1,
    limit = 10,
}: {
    page?: number;
    limit?: number;
}) => {

    page = Number(page);
    limit = Number(limit);

    if (page < 1 || isNaN(page)) page = 1;
    if (limit < 1 || isNaN(limit)) limit = 10;

    const skip = (page - 1) * limit;

    return { page, limit, skip };
};