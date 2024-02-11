import React from 'react';
import posed from 'react-pose';
import { MegaMenuLayout } from 'ssw.megamenu';
import { graphql, useStaticQuery } from 'gatsby';

// Example of a component-specific page transition
const AnimatedContainer = posed.div({
  enter: {
    y: 0,
    transition: {
      ease: 'easeInOut',
    },
  },
  exit: {
    y: '-100%',
    transition: {
      ease: 'easeInOut',
    },
  },
});

const Header = () => {
  const menuGroups = useStaticQuery(graphql`
    query {
      allMegaMenuGroup {
        edges {
          node {
            name
            url
            menuColumns {
              menuColumnGroups {
                name
                menuItems {
                  name
                  url
                  description
                  iconImg
                }
              }
            }
            sidebarItems {
              name
              items {
                name
                url
                description
                widgetType
                icon
              }
            }
            viewAll {
              name
              url
            }
          }
        }
      }
    }
  `);

  const menuItems = menuGroups.allMegaMenuGroup.edges.map((edge) => edge.node);

  return (
    <AnimatedContainer>
      <header>
        <div className="mx-2 md:mx-6 print-hidden no-underline">
          <MegaMenuLayout
            title="People"
            menuBarItems={menuItems}
            className="megamenu"
          />
        </div>
      </header>
    </AnimatedContainer>
  );
};

Header.propTypes = {};

export default Header;
