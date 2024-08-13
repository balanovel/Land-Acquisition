from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in land_acquisition/__init__.py
from land_acquisition import __version__ as version

setup(
	name="land_acquisition",
	version=version,
	description="for react web page",
	author="Bala Us",
	author_email="bala@noveloffice.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
