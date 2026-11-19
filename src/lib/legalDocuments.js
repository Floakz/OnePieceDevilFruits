function legalDocument(path, label, description) {
    return {
        path,
        label,
        seo: {
            title: `${label} | One Piece Devil Fruits`,
            description,
            canonical: `https://onepiecedevilfruits.com${path}`,
        },
    };
}

export const LEGAL_DOCUMENTS = {
    privacyPolicy: legalDocument('/privacy-policy', 'Privacy Policy', 'Read how One Piece Devil Fruits handles personal information and how to exercise your privacy rights.'),
    termsOfService: legalDocument('/terms-of-service', 'Terms of Service', 'Read the terms for using One Piece Devil Fruits and playing its fan games.'),
    legalNotice: legalDocument('/legal-notice', 'Legal Notice', 'Read about this independent One Piece fan site, franchise credits, and how to report a rights concern.'),
};
