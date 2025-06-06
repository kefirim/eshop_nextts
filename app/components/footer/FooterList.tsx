// Déclaration des types des props que le composant accepte
interface FooterListProps {
  children: React.ReactNode; // `children` représente le contenu entre les balises <Container>...</Container>
}

// Déclaration du composant fonctionnel Container avec le type React.FC
const FooterList: React.FC<FooterListProps> = ({ children }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-6 flex flex-col gap-2">
      {/* Affichage du contenu enfant */}
      {children}
    </div>
  );
};

export default FooterList;