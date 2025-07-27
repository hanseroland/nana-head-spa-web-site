// components/PrivacyPolicyPage.jsx
import React from 'react';
import { Box, Typography, Link, Divider, useTheme } from '@mui/material';

const PrivacyPolicyPage = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                px: { xs: 2, md: 8 },
                py: { xs: 6, md: 10 },
                maxWidth: '900px', // Limite la largeur pour une meilleure lisibilité
                margin: '0 auto', // Centre le contenu
                backgroundColor: theme.palette.background.paper, // Fond blanc ou gris clair
                borderRadius: '8px',
                boxShadow: theme.shadows[1],
                color: theme.palette.text.primary,
                lineHeight: 1.7, // Espacement des lignes pour la lisibilité
            }}
        >
            <Typography
                variant="h3"
                component="h1"
                sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    textAlign: 'center',
                    mb: 2,
                }}
            >
                Nana Head Spa
            </Typography>
            <Typography
                variant="h4"
                component="h2"
                sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    textAlign: 'center',
                    mb: 1,
                }}
            >
                Politique de Confidentialité
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    textAlign: 'center',
                    mb: 4,
                    fontStyle: 'italic',
                }}
            >
                Dernière mise à jour : 27 juillet 2025
            </Typography>

            <Typography paragraph>
                Bienvenue sur nanaheadspa.com. Chez Nana Head Spa, la protection de votre vie privée et de vos données personnelles est une priorité. Cette Politique de Confidentialité vous informe clairement sur les données que nous collectons, comment nous les utilisons et vos droits.
            </Typography>
            <Typography paragraph sx={{ mb: 4 }}>
                En utilisant notre site et nos services (chat, réservation), vous acceptez cette politique.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 1 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                1. Qui sommes-nous ?
            </Typography>
            <Typography paragraph>
                Le site <Link href="https://nanaheadspa.com" target="_blank" rel="noopener noreferrer" color="primary">nanaheadspa.com</Link> est géré par Nawël Prod’homme, opérant sous le nom de Nana Head Spa.
            </Typography>
            <Typography paragraph>
                Site web : <Link href="https://nanaheadspa.com" target="_blank" rel="noopener noreferrer" color="primary">nanaheadspa.com</Link><br />
                Email : <Link href="mailto:nanaheadspa22@gmail.com" color="primary">nanaheadspa22@gmail.com</Link><br />
                Téléphone : <Link href="tel:+33666735953" color="primary">+33 06 66 73 59 53</Link>
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 2 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                2. Quelles données personnelles collectons-nous et pourquoi ?
            </Typography>
            <Typography paragraph>
                Nous collectons vos données quand vous créez un compte, utilisez le chat ou réservez un soin. Ces données sont essentielles pour nos services.
            </Typography>

            <Typography variant="h6" component="h4" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 3 }}>
                Données d'Identification et de Contact :
            </Typography>
            <Typography paragraph>
                <b>Collectées :</b>Prénom, Nom, Adresse e-mail, Numéro de téléphone.<br />
                <b>Finalités :</b> Créer et gérer votre compte, vous identifier, communiquer avec vous (réservations, demandes chat, infos importantes).<br />
                <b>Base légale :</b> Exécution d'un contrat (accès aux services).
            </Typography>

            <Typography variant="h6" component="h4" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 3 }}>
                Données de Compte et d'Authentification :
            </Typography>
            <Typography paragraph>
                <b>Collectées :</b> Mot de passe (haché et sécurisé), rôle (client/admin).<br />
                <b>Finalités :</b> Sécuriser l'accès à votre compte, gérer les permissions.<br />
                <b>Base légale :</b> Exécution d'un contrat, intérêt légitime (sécurité).
            </Typography>

            <Typography variant="h6" component="h4" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 3 }}>
                Données de Réservation de Soins :
            </Typography>
            <Typography paragraph>
                <b>Collectées :</b> Votre identifiant, formule de soin, date et heure du rendez-vous, statut (en attente, confirmé, annulé, etc.). Notes admin, admin traitant la réservation et motif d'annulation peuvent être ajoutés en interne.<br />
                <b>Finalités :</b> Gérer et confirmer vos rendez-vous, vous informer du statut, optimiser notre planning.<br />
                <b>Base légale :</b> Exécution d'un contrat (prestation de service).
            </Typography>

            <Typography variant="h6" component="h4" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 3 }}>
                Données de Chat et de Messagerie :
            </Typography>
            <Typography paragraph>
                <b>Collectées :</b> Identifiants des participants, contenu des messages, horodatage, statut de lecture.<br />
                <b>Finalités :</b> Fournir le service de messagerie, permettre la communication avec notre équipe, conserver l'historique pour un meilleur suivi.<br />
                <b>Base légale :</b> Exécution d'un contrat (fourniture du service).
            </Typography>

            <Typography variant="h6" component="h4" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 3 }}>
                Données de Fidélité et d'Activité :
            </Typography>
            <Typography paragraph>
                <b>Collectées :</b> Niveau de fidélité, date et heure de la dernière pub vue, nombre total de pubs vues.<br />
                <b>Finalités :</b> Gérer votre programme de fidélité, déterminer vos avantages, suivre votre progression.<br />
                <b>Base légale :</b> Exécution d'un contrat (votre participation au programme).
            </Typography>

            <Typography variant="h6" component="h4" gutterBottom sx={{ color: theme.palette.text.secondary, mt: 3 }}>
                Données Techniques et d'Usage :
            </Typography>
            <Typography paragraph>
                Nous n'utilisons pas de cookies.<br />
                <b>Collectées :</b> Adresses IP (par l'hébergeur pour sécurité et diagnostic), logs de connexion.<br />
                <b>Finalités :</b> Assurer la sécurité de notre plateforme, diagnostiquer les problèmes techniques, prévenir la fraude.<br />
                <b>Base légale :</b> Intérêt légitime (sécurité et maintenance du site).
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 3 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                3. Comment utilisons-nous vos données ?
            </Typography>
            <Typography paragraph>
                Vos données sont utilisées uniquement pour les raisons expliquées ci-dessus. Elles nous aident à :
            </Typography>
            <Typography component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>Fournir, gérer et maintenir nos services (réservations, chat).</li>
                <li>Traiter vos réservations et gérer vos rendez-vous.</li>
                <li>Répondre à vos questions et vous offrir un support client.</li>
                <li>Gérer votre compte et votre programme de fidélité.</li>
                <li>Sécuriser notre site et prévenir les activités frauduleuses.</li>
                <li>Respecter nos obligations légales.</li>
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 4 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                4. Qui a accès à vos données ?
            </Typography>
            <Typography paragraph>
                Vos données sont confidentielles. Seul le personnel autorisé de Nana Head Spa y a accès, pour les finalités décrites.
            </Typography>
            <Typography paragraph>
                Nous ne partageons aucune de vos données personnelles avec des entreprises externes, sauf nos prestataires techniques essentiels :
            </Typography>
            <Typography component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>Hébergeur : Render.com</li>
                <li>Base de données : MongoDB Atlas</li>
            </Typography>
            <Typography paragraph>
                Ces prestataires sont nos sous-traitants et sont contractuellement tenus de respecter le RGPD.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 5 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                5. Transfert de données hors de l'UE/EEE
            </Typography>
            <Typography paragraph>
                Nos services (Render.io, MongoDB Atlas) peuvent stocker des données hors de l'UE/EEE. Ils s'engagent à respecter les standards RGPD et utilisent des mécanismes reconnus (comme les Clauses Contractuelles Types) pour protéger vos données.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 6 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                6. Combien de temps conservons-nous vos données ?
            </Typography>
            <Typography paragraph>
                Vos données personnelles sont conservées tant que l'application nanaheadspa.com existe et que votre compte est actif.
            </Typography>
            <Typography component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>
                    <b>Données de compte utilisateur (nom, email, tel, mot de passe haché, etc.) :</b> Conservées tant que votre compte est actif. Si vous supprimez votre compte, vos données seront supprimées ou anonymisées rapidement, sauf obligation légale.
                </li>
                <li>
                    <b>Données de réservation et de chat :</b> Conservées tant que votre compte est actif pour vous permettre de consulter votre historique. Elles sont supprimées en cas de suppression de compte.
                </li>
                <li>
                    <b>Logs techniques et de sécurité (adresses IP) :</b> Conservés quelques mois pour des raisons de sécurité et de diagnostic.
                </li>
            </Typography>
            <Typography paragraph>
                Nous supprimerons ou anonymiserons vos données dès qu'elles ne sont plus nécessaires, ou sur votre demande de suppression, sauf si une obligation légale nous contraint à les conserver.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 7 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                7. Vos droits en matière de protection des données
            </Typography>
            <Typography paragraph>
                Conformément au RGPD, vous avez les droits suivants :
            </Typography>
            <Typography component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><b>Droit d'accès :</b> Obtenir une copie de vos données.</li>
                <li><b>Droit de rectification :</b> Corriger vos données inexactes ou incomplètes.</li>
                <li><b>Droit à l'effacement ("droit à l'oubli") :</b> Demander la suppression de vos données (sous certaines conditions).</li>
                <li><b>Droit à la limitation du traitement :</b> Demander la limitation du traitement de vos données.</li>
                <li><b>Droit à la portabilité des données :</b> Recevoir vos données dans un format structuré et les transmettre à un autre responsable.</li>
                <li><b>Droit d'opposition :</b> Vous opposer au traitement de vos données (notamment pour le marketing direct).</li>
                <li><b>Droit de retirer votre consentement :</b> Retirer votre consentement à tout moment, si le traitement est basé sur celui-ci.</li>
                <li><b>Droit d'introduire une réclamation :</b> Déposer une plainte auprès d'une autorité de contrôle (ex: la CNIL en France).</li>
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 8 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                8. Comment exercer vos droits ?
            </Typography>
            <Typography paragraph>
                Contactez-nous à : <Link href="mailto:nanaheadspa22@gmail.com" color="primary">nanaheadspa22@gmail.com</Link>.
            </Typography>
            <Typography paragraph>
                Pour protéger votre vie privée, nous pourrions vérifier votre identité. Nous répondrons dans un délai d'un mois, prolongeable de deux mois si la demande est complexe ou nombreuse.
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 9 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                9. Mesures de sécurité
            </Typography>
            <Typography paragraph>
                Nous mettons en place des mesures techniques et organisationnelles pour protéger vos données contre l'accès, la divulgation, l'altération ou la destruction non autorisés. Cela inclut :
            </Typography>
            <Typography component="ul" sx={{ pl: 4, mb: 2 }}>
                <li>Chiffrement HTTPS/SSL/TLS pour toutes les communications.</li>
                <li>Hachage des mots de passe avant stockage.</li>
                <li>Contrôles d'accès stricts aux données et systèmes.</li>
                <li>Sécurité de la base de données via MongoDB Atlas.</li>
                <li>Sauvegardes régulières de notre base de données.</li>
            </Typography>

            <Divider sx={{ my: 4 }} />

            {/* Section 10 */}
            <Typography variant="h5" component="h3" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                10. Modifications de cette Politique de Confidentialité
            </Typography>
            <Typography paragraph>
                Nous pouvons modifier cette politique à tout moment. Les changements prendront effet dès leur publication sur notre site. Nous vous encourageons à consulter cette page régulièrement. En cas de modifications majeures, nous vous informerons par e-mail ou via une notification sur notre site.
            </Typography>
        </Box>
    );
};

export default PrivacyPolicyPage;