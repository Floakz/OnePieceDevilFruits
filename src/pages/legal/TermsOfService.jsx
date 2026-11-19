import LegalDocument from './LegalDocument.jsx';
import { LEGAL_DOCUMENTS } from '../../lib/legalDocuments.js';
import terms from '../../../terms-of-service.txt?raw';

export default function TermsOfService() {
    return <LegalDocument seo={LEGAL_DOCUMENTS.termsOfService.seo} html={terms} />;
}
