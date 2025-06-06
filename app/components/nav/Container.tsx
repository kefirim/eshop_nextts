// Déclaration des types des props que le composant accepte
interface ContainerProps {
  children: React.ReactNode; // `children` représente le contenu entre les balises <Container>...</Container>
}

// Déclaration du composant fonctionnel Container avec le type React.FC
const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-[1920px] mx-auto xl:px-20 md:px-2 px-4">
      {/* Affichage du contenu enfant */}
      {children}
    </div>
  );
};

export default Container;
