import LegalDocument from './LegalDocument.jsx';
import { LEGAL_DOCUMENTS } from '../../lib/legalDocuments.js';
import policy from '../../../privacy-policy.txt?raw';

export default function PrivacyPolicy() {
    return <LegalDocument seo={LEGAL_DOCUMENTS.privacyPolicy.seo} html={policy} />;
}
